import * as act from "src/actions/types";
import cloneDeep from "lodash/cloneDeep";
import unionBy from "lodash/unionBy";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  proposalCredits: 0
};

const user = (state = DEFAULT_STATE, action) =>
  action.error
    ? () => state
    : {
        [act.RECEIVE_USER_PROPOSAL_CREDITS]: () => {
          console.log("IN USER REDUCER NORMALIZED");
          console.log("IN USER REDUCER NORMALIZED");
          console.log(action);
        },
        [act.SET_PROPOSAL_CREDITS]: () => {
          console.log("IN SET PROPOSAL CREDITS NORMALIZED");
          console.log("IN SET PROPOSAL CREDITS NORMALIZED");
          console.log(action);
        }
      };

export default user;
