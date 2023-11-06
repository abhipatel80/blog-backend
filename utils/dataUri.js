import DataURIParser from "datauri/parser.js";
import path from "path";

const getDatauri = (file) => {
  const parser = new DataURIParser();
  const fileExtension = path.extname(file.originalname).toString();
  const filename = parser.format(fileExtension, file.buffer);
  return filename;
};

export default getDatauri;
