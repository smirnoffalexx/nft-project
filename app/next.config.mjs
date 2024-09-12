/** @type {import('next').NextConfig} */
import * as dotenv from "dotenv";

dotenv.config({path: '/.env.frontend'});

const nextConfig = {
    env: {
        FACTORY_ADDRESS: process.env.FACTORY_ADDRESS,
    },
};

export default nextConfig;
