package main

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

var FACTORY_ADDRESS string
var FACTORY_ABI abi.ABI
var COLLECTIONS []string
var EVENTS []map[string]interface{}

func main() {
	if err := run(); err != nil {
		logrus.Error(err)
		panic(err)
	}
}

func run() error {
	err := godotenv.Load()
	if err != nil {
		return err
	}

	if err := loadABI(); err != nil {
		return err
	}

	EVENTS = make([]map[string]interface{}, 0)
	FACTORY_ADDRESS = os.Getenv("FACTORY_ADDRESS")
	client, err := ethclient.Dial(os.Getenv("ALCHEMY_URL"))
	if err != nil {
		return err
	}

	go subscribeToEvents(client)

	router := gin.New()
	router.GET("/events", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"events": EVENTS})
	})
	router.GET("/collections", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"collections": COLLECTIONS})
	})

	if err := router.Run(":8080"); err != nil {
		return err
	}

	return nil
}

func loadABI() error {
	b, err := os.ReadFile("../contracts/abi/CollectionFactory.json")
	if err != nil {
		return err
	}

	FACTORY_ABI, err = abi.JSON(strings.NewReader(string(b)))
	if err != nil {
		return err
	}

	return nil
}

func subscribeToEvents(client *ethclient.Client) error {
	query := ethereum.FilterQuery{
		Addresses: []common.Address{common.HexToAddress(FACTORY_ADDRESS)},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		return err
	}

	oldLogs, err := client.FilterLogs(context.Background(), query)
	if err != nil {
		return err
	}

	for _, vLog := range oldLogs {
		if err := processTxLog(vLog); err != nil {
			logrus.Error(err)
		}
	}

	for {
		select {
		case err := <-sub.Err():
			return err
		case vLog := <-logs:
			if err := processTxLog(vLog); err != nil {
				logrus.Error(err)
			}
		}
	}

	return nil
}

func processTxLog(vLog types.Log) error {
	event, err := FACTORY_ABI.EventByID(vLog.Topics[0])
	if err != nil {
		return err
	}

	outputMap := make(map[string]interface{})
	err = FACTORY_ABI.UnpackIntoMap(outputMap, event.Name, vLog.Data)
	if err != nil {
		return err
	}

	eventName := event.Name
	outputMap["event"] = eventName

	EVENTS = append(EVENTS, outputMap)

	if eventName == "CollectionCreated" {
		collectionAddress := outputMap["collection"].(common.Address).String()
		COLLECTIONS = append(COLLECTIONS, collectionAddress)
	}

	logrus.Info("New event: ", outputMap)

	return nil
}
