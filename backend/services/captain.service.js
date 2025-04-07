import captainModel from "../models/captain.model.js";

const createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }
  const captain = captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
    email,
    password,
  });
  return captain;
};

export default createCaptain;