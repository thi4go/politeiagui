import React, { useMemo } from "react";
import { Message } from "pi-ui";
import get from "lodash/fp/get";
import { withRouter } from "react-router-dom";
import Proposal from "src/components/Proposal";
import styles from "./Detail.module.css";
import { useProposal } from "./hooks";
import Comments from "src/containers/Comments";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { getCommentBlockedReason } from "./helpers";
import {
  isVotingFinishedProposal,
  getProposalToken,
  isCensoredProposal,
  isAbandonedProposal,
  getProposalLink
} from "../helpers";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import { useProposalVote } from "../hooks";
import { makeGetProposalName } from "src/selectors";
import { useSelector } from "src/redux";
import { useDocumentTitle } from "src/hooks/utils/useDocumentTitle";
import { GoBackLink } from "src/components/Router";

const ProposalDetail = ({ Main, match, state }) => {
  const tokenFromUrl = get("params.token", match);
  const proposalNameSelector = useMemo(
    () => makeGetProposalName(tokenFromUrl),
    [tokenFromUrl]
  );
  const proposalName = useSelector(proposalNameSelector);
  useDocumentTitle(proposalName);
  const threadParentCommentID = get("params.commentid", match);
  const { proposal, loading, threadParentID, error } = useProposal(
    tokenFromUrl,
    state,
    threadParentCommentID
  );
  const proposalToken = getProposalToken(proposal);
  const { voteSummary } = useProposalVote(proposalToken);
  const canReceiveComments =
    !isVotingFinishedProposal(voteSummary) && !isAbandonedProposal(proposal);
  return (
    <>
      <Main className={styles.customMain} fillScreen>
        <GoBackLink />
        <UnvettedActionsProvider>
          <PublicActionsProvider>
            {error ? (
              <Message kind="error">{error.toString()}</Message>
            ) : loading || !proposal ? (
              <ProposalLoader extended />
            ) : (
              <Proposal
                proposal={proposal}
                extended
                collapseBodyContent={!!threadParentID}
              />
            )}
            {proposal && !isCensoredProposal(proposal) && (
              <Comments
                recordAuthorID={proposal.userid} // this will be deprecated after tlog
                recordAuthorUsername={proposal.username}
                recordToken={proposalToken}
                numOfComments={proposal.comments}
                threadParentID={threadParentID}
                readOnly={!canReceiveComments}
                readOnlyReason={getCommentBlockedReason(proposal, voteSummary)}
                proposalState={state}
                recordBaseLink={getProposalLink(proposal)}
              />
            )}
          </PublicActionsProvider>
        </UnvettedActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
