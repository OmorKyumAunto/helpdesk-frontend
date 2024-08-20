import notification from "../common/utils/Notification";
const asyncWrapper = async (cb: () => Promise<void>) => {
  try {
    await cb();
  } catch (err: any) {
    if (err.error) {
      notification("error", err.error.data.message as string);
    } else {
      notification("error", "Something went wrong!" as string);
    }
  }
};

export default asyncWrapper;
