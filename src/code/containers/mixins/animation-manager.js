import React, { Component } from 'react';
import AnimatedComponentView from '../../components/animated-component';

export default function animationManager (WrappedComponent) {
  return class AnimationManagingComponent extends Component {

    constructor(props) {
      super(props);
      this.state = {
        animatedComponents: [],
        animatedComponentToRender: null,
        lastAnimatedComponentId: 0
      };

      // Bind callback methods to make `this` the correct context.
      this.render = this.render.bind(this);
    }

    render() {
      const runAnimation = (animatedComponentToRender, animationEvent, positions, opacity, speed = "fast", animationFinish) => {
        let startDisplay = {
          startPositionRect: positions.startPositionRect,
          opacity: opacity.start,
          size: positions.startSize
        };
        let targetDisplay = {
          targetPositionRect: positions.targetPositionRect,
          opacity: opacity.end,
          size: positions.endSize
        };

        let animationSpeed = speed;

        let newAnimatedComponents = this.state.animatedComponents;
        newAnimatedComponents.push(
          <AnimatedComponentView key={this.state.lastAnimatedComponentId}
            animEvent={animationEvent}
            speed={animationSpeed}
            viewObject={animatedComponentToRender}
            startDisplay={startDisplay}
            targetDisplay={targetDisplay}
            runAnimation={true}
            onRest={animationFinish} />
        );

        this.setState({
          animatedComponents: newAnimatedComponents,
          lastAnimatedComponentId: this.state.lastAnimatedComponentId + 1
        });
      };

      const handleAnimateComponents = (componentsToAnimate, positions, opacity, animationEvent, animationFinish) => {
        for (let i = 0; i < componentsToAnimate.length; i++){
          runAnimation(componentsToAnimate[i], animationEvent, positions[i], opacity, "fast", animationFinish);
        }
      };

      const handleClearAnimatedComponents = () => {
        this.setState({
          animatedComponents: []
        });
      };

      return (
        <div>
          <WrappedComponent {...this.props} {...this.state} animateComponents={handleAnimateComponents} clearAnimatedComponents={handleClearAnimatedComponents}/>
          { this.state.animatedComponents }
        </div>
      );
    }
  };
}
