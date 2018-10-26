import React from "react";
import voteStatsConnector from "../connectors/voteStats";
import StackedBarChart from "./StackedBarChart";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { getRandomColor } from "../helpers";
import Tooltip from "./Tooltip";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  NETWORK
} from "../constants";


const mapVoteStatusToMessage = {
  [PROPOSAL_VOTING_ACTIVE]: "Proposal voting active",
  [PROPOSAL_VOTING_FINISHED]: "Proposal voting finished",
  [PROPOSAL_VOTING_NOT_AUTHORIZED]: "Author has not yet authorized the start of voting",
  [PROPOSAL_VOTING_AUTHORIZED]: "Waiting for administrator approval to start voting"
};

const VoteStatusLabel = ({ status }) => {
  const spanStyle = {
    fontWeight: "bold"
  };
  const mapVoteStatusToLabel = {
    [PROPOSAL_VOTING_ACTIVE]: (
      <span style={{
        ...spanStyle,
        color: "#41bf53"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_FINISHED]: (
      <span style={{
        ...spanStyle,
        color: "#091440"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_NOT_AUTHORIZED]: (
      <span style={{
        ...spanStyle,
        color: "#8997a5"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    ),
    [PROPOSAL_VOTING_AUTHORIZED]: (
      <span style={{
        ...spanStyle,
        color: "#FFC84E"
      }}>
        {mapVoteStatusToMessage[status]}
      </span>
    )
  };
  return mapVoteStatusToLabel[status] || null;
};

const VoteStatusIcon = ({ status }) => {
  const mapVoteStatusToIcon = {
    [PROPOSAL_VOTING_ACTIVE]: (
      <div style={{ width: "50px" }}>
        <img src={require("../style/proposal-active.png")} width="60" height="60" alt="Active Proposal" />
      </div>
    ),
    [PROPOSAL_VOTING_FINISHED]: (
      <div style={{ width: "50px" }}>
        <img src={require("../style/proposal-finished.png")} width="60" height="60" alt="Finished Proposal"/>
      </div>
    ),
    [PROPOSAL_VOTING_NOT_AUTHORIZED]: (
      <div style={{ width: "50px" }}>
        <img src={require("../style/proposal-notauth.png")} width="60" height="60" alt="Not Authorized Proposal"/>
      </div>
    ),
    [PROPOSAL_VOTING_AUTHORIZED]: (
      <div style={{ width: "50px" }}>
        <img src={require("../style/proposal-waiting.png")} width="60" height="60" alt="Authorized Proposal"/>
      </div>
    )
  };
  return mapVoteStatusToIcon[status] || null;
};

const getPercentage = (received, total) => Number.parseFloat((received/total)*100).toFixed(2);
const sortOptionYesFirst = a => a.id === "yes" ? -1 : 1;

class Stats extends React.Component {
  getColor = optionId => {
    switch(optionId) {
    case "yes":
      return "#def9f7";
    case "no":
      return "#FFF";
    default:
      return getRandomColor();
    }
  }
  canShowStats = (status, totalVotes) => {
    console.log(status);
    console.log(totalVotes);
    console.log("------------");
    return (status === PROPOSAL_VOTING_ACTIVE || status === PROPOSAL_VOTING_FINISHED) && totalVotes > 0;
  }
  transformOptionsResult = (totalVotes, optionsResult = []) =>
    optionsResult
      .map(({ option, votesreceived }) => ({
        id: option.id,
        description: option.description,
        votesReceived: votesreceived,
        percentage: getPercentage(votesreceived, totalVotes),
        color: this.getColor(option.id)
      })).sort(sortOptionYesFirst)
  renderStats = (option) => {
    const optionStyle = {
      display: "flex",
      marginRight: "8px"
    };
    const optionIdStyle = {
      textTransform: "uppercase",
      fontWeight: "semibold",
      marginRight: "4px"
    };
    return (
      <span key={`option-${option.id}`} style={optionStyle} >
        { option.id === "yes" ?
          (
            <Tooltip
              tipStyle={{ fontSize: "11px", top: "20px", left: "20px", width: "36px" }}
              text="Yes"
              position="bottom"
            >
              <span>
                <span style={optionIdStyle} >{` ✔ ${option.votesReceived}`}</span>
              </span>
            </Tooltip>
          ) :
          (
            <Tooltip
              tipStyle={{ fontSize: "11px", top: "20px", left: "20px", width: "29px" }}
              text="No"
              position="bottom"
            >
              <span style={{ marginRight: "25px" }}>
                <span style={optionIdStyle} >{` ✖ ${option.votesReceived}`}</span>
              </span>
            </Tooltip>
          )
        }

      </span>
    );
  };
  getChartData = (options) =>
    options.map(op => ({
      label: op.id,
      value: op.percentage,
      color: op.color
    }));

  getTimeInBlocks = (endHeight, currentHeight) => {
    const blocks = endHeight - currentHeight;
    const blockTimeMinutes = NETWORK === "testnet" ? blocks*2 : blocks*5 ;
    const mili = blockTimeMinutes * 60000;
    const dateMs = new Date(mili + Date.now()); // gets time in ms
    const distance = distanceInWordsToNow(
      dateMs,
      { addSuffix: true }
    );
    const element = (
      <Tooltip
        tipStyle={{ fontSize: "11px", top: "20px", left: "20px", width: "90px" }}
        text={"Voting ends at block #"+endHeight}
        position="bottom"
      >
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <span>{blocks === 0 ? "last block left" : blocks + " blocks left"}</span>
          <span style={{ fontSize: "11px" }}>expires {distance}</span>
        </div>
      </Tooltip>
    );
    return blockTimeMinutes > 0 ? element : <span>expired</span>;
  };
  renderOptionsStats = (totalVotes, optionsResult, endHeight, currentHeight) => {

    const { status } = this.props;
    const showStats = this.canShowStats(status, totalVotes);
    const options = optionsResult ? this.transformOptionsResult(totalVotes, optionsResult) : [];
    const isPreVoting = status === PROPOSAL_VOTING_NOT_AUTHORIZED || status === PROPOSAL_VOTING_AUTHORIZED;
    const headerStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "500px"
    };
    const detailStyle = {
      color: "gray"
    };

    const bodyStyle = { marginTop: "10px" };
    return (
      <div >
        <div style={headerStyle}>
          <VoteStatusLabel status={status} />
          {showStats && <span style={{ marginLeft: "20px" }}>Votes: </span>}
          {!isPreVoting && !showStats ?
            (<div style={detailStyle}><p>zero votes</p></div>)
            : null }
          {showStats && options.map(op => this.renderStats(op))}
          {endHeight && currentHeight ? this.getTimeInBlocks(endHeight, currentHeight) : null}

        </div>
        {showStats ?
          <div style={bodyStyle}>
            <StackedBarChart
              displayValuesForLabel="yes"
              style={{ ...bodyStyle, maxWidth: "600px" }}
              data={this.getChartData(options)}
            />
          </div> : null
        }
      </div>
    );
  }
  render() {
    const { totalVotes, optionsResult, endHeight, currentHeight } = this.props;
    return this.renderOptionsStats(totalVotes, optionsResult, endHeight, currentHeight);
  }
}

class VoteStats extends React.Component {
  render() {
    const { token, getVoteStatus, lastBlockHeight } = this.props;
    const { optionsresult, status, totalvotes, endheight } = getVoteStatus(token);
    const wrapperStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      border: "1px solid #bbb",
      marginTop: "10px",
      borderRadius: "8px",
      width: "600px"
    };
    console.log(status);
    return(
      <div style={wrapperStyle}>
        <VoteStatusIcon status={status} />
        <Stats status={status} optionsResult={optionsresult} totalVotes={totalvotes} endHeight={endheight} currentHeight={lastBlockHeight}/>
      </div>
    );
  }
}

export default voteStatsConnector(VoteStats);
