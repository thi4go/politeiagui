import { Button, Card, classNames, Spinner } from "pi-ui";
import React, { useEffect } from "react";
import useBooleanState from "src/hooks/utils/useBooleanState";
import usePaywall from "src/hooks/api/usePaywall";
import styles from "./Credits.module.css";
import { useCredits } from "./hooks.js";
import UserModals from "./components/UserModals";
import RegistrationFeeSection from "./components/RegistrationFeeSection";
import ProposalCreditsSection from "./components/ProposalCreditsSection";
import CreditHistorySection from "./components/CreditHistorySection.jsx";

const Credits = ({ user }) => {
  const userID = user && user.userid;
  const { isPaid } = usePaywall();
  const {
    proposalCreditPrice,
    isApiRequestingUserProposalCredits,
    proposalCredits,
    toggleCreditsPaymentPolling,
    toggleProposalPaymentReceived,
    proposalPaymentReceived,
    onPollProposalPaywallPayment,
    shouldPollPaywallPayment
  } = useCredits(userID);

  const [
    showPaywallModal,
    openPaywallModal,
    closePaywallModal
  ] = useBooleanState(false);
  const [
    showProposalCreditsModal,
    openProposalCreditsModal,
    closeProposalCreditsModal
  ] = useBooleanState(false);

  useEffect(() => {
    if (shouldPollPaywallPayment) {
      toggleCreditsPaymentPolling(true);
      toggleProposalPaymentReceived(false);
      onPollProposalPaywallPayment(true);
    }
  }, [
    shouldPollPaywallPayment,
    onPollProposalPaywallPayment,
    toggleCreditsPaymentPolling,
    toggleProposalPaymentReceived
  ]);

  useEffect(() => {
    if (proposalPaymentReceived) {
      toggleCreditsPaymentPolling(false);
      closeProposalCreditsModal();
    }
  }, [
    proposalPaymentReceived,
    closeProposalCreditsModal,
    toggleCreditsPaymentPolling
  ]);

  return isApiRequestingUserProposalCredits ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className={classNames("container", "margin-bottom-m")}>
      <RegistrationFeeSection
        isPaid={isPaid}
        isAdmin={false}
        isUser
        openPaywallModal={openPaywallModal}
      />
      <ProposalCreditsSection
        proposalCredits={proposalCredits}
        proposalCreditPrice={proposalCreditPrice}
      />
      {isPaid && (
        <Button
          className="margin-top-s"
          size="sm"
          onClick={openProposalCreditsModal}>
          Purchase more
        </Button>
      )}
      <CreditHistorySection
        user={user}
        proposalCreditPrice={proposalCreditPrice}
      />
      <UserModals
        user={user}
        showPaywallModal={showPaywallModal}
        closePaywallModal={closePaywallModal}
        showProposalCreditsModal={showProposalCreditsModal}
        closeProposalCreditsModal={closeProposalCreditsModal}
      />
    </Card>
  );
};

export default Credits;
