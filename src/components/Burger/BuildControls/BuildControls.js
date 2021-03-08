import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' },
];

const buildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      <p>
        Current Price: <strong>Rs.{props.price.toFixed(2)}/-</strong>
      </p>
      {controls.map((ctr) => (
        <BuildControl
          key={ctr.label}
          label={ctr.label}
          added={() => props.addIngredient(ctr.type)}
          remove={() => props.removeIngredient(ctr.type)}
          minLimitDisabled={props.minLimitDisabled[ctr.type]}
          maxLimitDisabled={props.maxLimitDisabled[ctr.type]}
        />
      ))}
      <button
        className={classes.OrderButton}
        disabled={props.purchasable}
        onClick={props.clicked}
      >
        ORDER NOW
      </button>
    </div>
  );
};

export default buildControls;
