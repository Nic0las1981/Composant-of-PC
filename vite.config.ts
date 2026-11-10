import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {catalogDataPlugin} from './build/catalogDataPlugin.ts';
export default defineConfig({ base: "./", plugins: [catalogDataPlugin(), react()] });
