import { Router } from "express";
import { shortenUrl } from "../Controller/url.controller.js";

const urlRouter = Router();

urlRouter.get("/shorten", shortenUrl)


export default urlRouter;