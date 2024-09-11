"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Event {
  collection: string;
  event: string;
  name: string | undefined;
  symbol: string | undefined;
  recipient: string | undefined;
  tokenId: number | undefined;
  tokenUri: string | undefined;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const EventsDisplay: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get("http://localhost:8080/events");

        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events", error);
      }

      await sleep(5000);
      fetchEvents();
    }
    fetchEvents();
  }, [events]);

  return (
    <div>
      <h2>Contract Events:</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event, index) => (
            <div key={index}>
              <h3>{event.event}</h3>
              <h3>{`Collection address: ${event.collection}`}</h3>
              <h3>
                {event.event == "CollectionCreated"
                  ? `name: ${event.name}, symbol: ${event.symbol}`
                  : `recipient: ${event.recipient}, tokenId: ${event.tokenId}, tokenUri: ${event.tokenUri}`}
              </h3>
              {/* <li key={index}>{JSON.stringify(event)}</li> */}
              <br></br>
            </div>
          ))}
        </ul>
      ) : (
        <p>No events found</p>
      )}
    </div>
  );
};

export default EventsDisplay;
