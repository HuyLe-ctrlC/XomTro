export function checkIfFilesAreTooBig(files) {
  console.log(12313);
  let valid = true;
  if (files) {
    files.map((file) => {
      const size = file.size / 1024 / 1024;
      console.log("size", size);
      if (size > 1) {
        valid = false;
      }
    });
  }
  return valid;
}

export function checkIfFilesAreCorrectType(files) {
  let valid = true;
  if (files) {
    files.map((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        valid = false;
      }
    });
  }
  return valid;
}
