import React, { Component } from 'react';
import Wrapper from '../../../hoc/Wrapper/Wrapper';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
	componentWillUpdate() {
		// console.log("[OrderSummary] Will update");
	}

	render() {
		const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => (
			<li key={igKey}>
				<span style={{ textTransform: 'capitalize' }}>{igKey}</span> :
				{this.props.ingredients[igKey]}
			</li>
		));

		return (
			<Wrapper>
				<h3>Your Order</h3>
				<p>A delicious burger with the following ingredients:</p>
				<ul>{ingredientSummary}</ul>
				<hr />
				<p>
					<strong>Total Price: Rs.{this.props.price.toFixed(2)}/-</strong>
				</p>
				<p>Continue to Checkout?</p>
				<Button btnType="Danger" clicked={this.props.purchaseCancelled}>
					CANCEL
				</Button>
				<Button btnType="Success" clicked={this.props.purchaseContinued}>
					CONTINUE
				</Button>
			</Wrapper>
		);
	}
}

// const orderSummary = (props) => {
//   const ingredientSummary = Object.keys(props.ingredients).map((igKey) => (
//     <li key={igKey}>
//       <span style={{ textTransform: 'capitalize' }}>{igKey}</span> :
//       {props.ingredients[igKey]}
//     </li>
//   ));
//   return (
//     <Wrapper>
//       <h3>Your Order</h3>
//       <p>A delicious burger with the following ingredients:</p>
//       <ul>{ingredientSummary}</ul>
//       <hr />
//       <p>
//         <strong>Total Price: Rs.{props.price.toFixed(2)}/-</strong>
//       </p>
//       <p>Continue to Checkout?</p>
//       <Button btnType="Danger" clicked={props.purchaseCancelled}>
//         CANCEL
//       </Button>
//       <Button btnType="Success" clicked={props.purchaseContinued}>
//         CONTINUE
//       </Button>
//     </Wrapper>
//   );
// };

export default OrderSummary;
