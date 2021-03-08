import React, { Component } from 'react';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Wrapper from '../../hoc/Wrapper/Wrapper';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
	state = {
		purchasing: false,
		loading: false,
		error: false,
	};

	componentDidMount() {
		// axios
		// 	.get('/ingredients.json')
		// 	.then(res => {
		// 		this.setState({ ingredients: res.data });
		// 	})
		// 	.catch(err => {
		// 		this.setState({ error: true });
		// 	});
	}

	updatePurchasable(ingredients) {
		const sumIngredients = Object.keys(ingredients)
			.map(igKey => ingredients[igKey])
			.reduce((acc, cur) => {
				return acc + cur;
			}, 0);

		return sumIngredients <= 0;
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
	};

	addIngredientHandler = type => {
		const updatedTotalPrice = this.state.totalPrice; //+ INGREDIENT_PRICES[type];
		const newIngredientValue = this.state.ingredients[type] + 1;
		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = newIngredientValue;

		this.setState({
			ingredients: updatedIngredients,
			totalPrice: updatedTotalPrice,
		});
		this.updatePurchasable(updatedIngredients);
	};

	removeIngredientHandler = type => {
		const updatedTotalPrice = this.state.totalPrice; //- INGREDIENT_PRICES[type];

		if (updatedTotalPrice <= 0) {
			return;
		}
		const newIngredientValue = this.state.ingredients[type] - 1;
		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = newIngredientValue;

		this.setState({
			ingredients: updatedIngredients,
			totalPrice: updatedTotalPrice,
		});
		this.updatePurchasable(updatedIngredients);
	};

	render() {
		const ingredients = { ...this.props.ingredients };
		const minLimitDisableInfo = [];
		const maxLimitDisableInfo = [];
		for (let ingredient in ingredients) {
			minLimitDisableInfo[ingredient] = ingredients[ingredient] <= 0;
			maxLimitDisableInfo[ingredient] = ingredients[ingredient] >= 5;
		}

		let orderSummary = null;

		let burger = this.state.error ? (
			<p>Ingredient's can't be loaded!</p>
		) : (
			<Spinner />
		);

		if (this.props.ingredients) {
			burger = (
				<Wrapper>
					<Burger ingredients={this.props.ingredients} />
					<BuildControls
						addIngredient={this.props.onAddIngredient}
						removeIngredient={this.props.onRemoveIngredient}
						minLimitDisabled={minLimitDisableInfo}
						maxLimitDisabled={maxLimitDisableInfo}
						purchasable={this.updatePurchasable(this.props.ingredients)}
						price={this.props.totalPrice}
						clicked={this.purchaseHandler}
					/>
				</Wrapper>
			);

			orderSummary = (
				<OrderSummary
					ingredients={this.props.ingredients}
					price={this.props.totalPrice}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinued={this.purchaseContinueHandler}
				/>
			);
		}

		if (this.state.loading) {
			orderSummary = <Spinner />;
		}

		return (
			<Wrapper>
				<Modal
					show={this.state.purchasing}
					closeModal={this.purchaseCancelHandler}
				>
					{orderSummary}
				</Modal>
				{burger}
			</Wrapper>
		);
	}
}

const mapStateToProps = state => {
	return {
		ingredients: state.ingredients,
		totalPrice: state.totalPrice,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAddIngredient: igName =>
			dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: igName }),
		onRemoveIngredient: igName =>
			dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: igName }),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
