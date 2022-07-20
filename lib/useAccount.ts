import { Account, Client, Models } from "appwrite";
import { AsyncEffectResult, useAsyncResult } from "./helper";

export type UseAccountResult<Preferences> = AsyncEffectResult<
  Models.User<Preferences>
>;

export default function useAccount<Preferences>(
  appwrite: Client
): UseAccountResult<Preferences> {
  return useAsyncResult<Models.User<Preferences>>((set, error) => {
    const account = new Account(appwrite);
    account
      .get()
      // @ts-ignore
      .then(set)
      .catch(error);

    return appwrite.subscribe("account", (e) => {
      set(e.payload as Models.User<Preferences>);
    });
  });
}
