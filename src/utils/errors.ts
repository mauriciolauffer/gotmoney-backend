export const CustomErrors = {
  HTTP: {
    get404: () => {
      const err = new Error('Not Found!') as any;
      err.code = 'NOT_FOUND';
      err.status = 404;
      return err;
    },
  },
};

export default CustomErrors;
