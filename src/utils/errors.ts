export const CustomErrors = {
  HTTP: {
    get400: (message = "Bad Request!") => {
      const err = new Error(message) as any;
      err.code = "BAD_REQUEST";
      err.status = 400;
      return err;
    },
    get401: (message = "Unauthorized!") => {
      const err = new Error(message) as any;
      err.code = "UNAUTHORIZED";
      err.status = 401;
      return err;
    },
    get403: (message = "Forbidden!") => {
      const err = new Error(message) as any;
      err.code = "FORBIDDEN";
      err.status = 403;
      return err;
    },
    get404: (message = "Not Found!") => {
      const err = new Error(message) as any;
      err.code = "NOT_FOUND";
      err.status = 404;
      return err;
    },
    get500: (message = "Internal Server Error!") => {
      const err = new Error(message) as any;
      err.code = "INTERNAL_SERVER_ERROR";
      err.status = 500;
      return err;
    },
  },
};

export default CustomErrors;
