import express from "express";
import createHttpError from "http-errors";
import ExperienceModel from "./model.js";
import UserModel from "../user/model.js";
import { HttpError } from "http-error";

const experienceRouter = express.Router();

experienceRouter.post("/", async (req, res, next) => {
  try {
    const { experience_id } = await ExperienceModel.create(req.body);
    res.status(201).send({ experience_id });
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/user/:userId", async (req, res, next) => {
  try {
    const experiences = await ExperienceModel.findAll({
      where: {
        user_id: req.params.userId,
      },
      include: [
        { model: UserModel, attributes: ["name", "surename", "image"] },
      ],
    });
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/:experience_id", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByPk(
      req.params.experience_id,
      {
        include: [
          { model: UserModel, attributes: ["name", "surename", "image"] },
        ],
      }
    );
    if (experience) {
      res.send(experience);
    } else {
      createHttpError(
        404,
        `Experience with id ${req.params.userId} not found!`
      );
    }
  } catch (error) {
    next(error);
  }
});

experienceRouter.put("/:experience_id", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ExperienceModel.update(
      req.body,
      { where: { experience_id: req.params.experience_id }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.experience_id} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experienceRouter.delete("/:experience_id", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ExperienceModel.destroy({
      where: { experience_id: req.params.experience_id },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.experience_id} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default experienceRouter;
