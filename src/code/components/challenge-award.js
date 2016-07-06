import React, {PropTypes} from 'react';

class ChallengeAwardView extends React.Component {

  static propTypes = {
    challengeAwards: PropTypes.object,
    size: PropTypes.number,
    coinParts: PropTypes.number
  };

  static defaultProps = {
     challengeAwards: {"caseId":0, "challengeId":0, "challengeCount":0, "progress":[]},
     size: 256,
     coinParts: 3
  };

  addAwardImage = (progressImages, pieces, pieceNum, score, pieceStyle) => {
    let awardLevel = "gold";
    if (score === 1) awardLevel = "silver";
    if (score >= 2) awardLevel = "bronze";
    if (score > -1){
      let pieceName = `coin piece pieces${pieces} piece${pieceNum} ${pieceStyle} ${awardLevel}`;
      progressImages.push(<div key={pieceNum} className={pieceName} />);
    }
    return progressImages;
  };

  render() {
    let caseId = 0, challengeId = 0, challengeCount = 0, progress = [], challengeBackgroundImage, currentPiece = [], progressImages = [];

    if (this.props.challengeAwards.challengeId != null) {
      caseId = this.props.challengeAwards.caseId,
      challengeId = this.props.challengeAwards.challengeId,
      challengeCount = this.props.challengeAwards.challengeCount;
      progress = this.props.challengeAwards.progress;
      challengeBackgroundImage = <div className="coin background" />;
    } else return null;

    if (!progress || progress === [])
      return null;
    
    let size = this.props.size || 256;
    let sizeStyle = {
      width: size + "px",
      height: size + "px"
    };

    let pieceKey = caseId + ":";
    let challengeScore = {};

    for (let i = 0; i < challengeCount; i++){
      for (var key in progress){
        if (key.startsWith(pieceKey + i)){
          let score = progress[key];
          let currentScore = challengeScore[i];
          if (!currentScore) {
             challengeScore[i] = score;
          } else {
            currentScore = currentScore + score;
            challengeScore[i] = score;
          }
        }
      }
    }
    let pieceNum = challengeId + 1;
    currentPiece = this.addAwardImage(currentPiece, challengeCount, pieceNum, challengeScore[challengeId], "single");

    for (var challenge in challengeScore){
      pieceNum = parseInt(challenge) + 1;
      progressImages = this.addAwardImage(progressImages, challengeCount, pieceNum, challengeScore[challenge], "whole");
    }


    return (
      <div className="geniblocks challenge-award" style={sizeStyle} >
        {challengeBackgroundImage}
        {progressImages}
        {currentPiece}
      </div>
    );
  }
}

export default ChallengeAwardView;
