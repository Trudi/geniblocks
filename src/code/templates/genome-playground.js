import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import ChangeSexButtons from '../components/change-sex-buttons';

export default class GenomeContainer extends Component {

  render() {
    const { drakes, chromosomeAlleleChange, sexChange, navigateNextChallenge } = this.props,
          drakeDef = drakes[0][0].alleleString,
          drakeSex = drakes[0][0].sex,
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, drakeSex);

    const onAlleleChange = function(chrom, side, prevAllele, newAllele) {
      chromosomeAlleleChange([0,0], chrom, side, prevAllele, newAllele);
    };

    const onSexChange = function(newSex) {
      sexChange([0,0], newSex);
    };

    const onAdvanceChallenge = function() {
      navigateNextChallenge();
    };

    return (
      <div>
        <div>
          <OrganismView org={ drake } />
        </div>
        <div>
          <ChangeSexButtons sex={ drakeSex } onChange= { onSexChange } />
        </div>
        <div>
          <GenomeView org={ drake } onAlleleChange={ onAlleleChange }/>
        </div>
        <div>
          <ButtonView label="Bring It On!" onClick={ onAdvanceChallenge } />
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    chromosomeAlleleChange: PropTypes.func.isRequired,
    sexChange: PropTypes.func.isRequired,
    navigateNextChallenge: PropTypes.func.isRequired
  };
}
