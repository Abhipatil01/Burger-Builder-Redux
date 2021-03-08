import React, { Component } from 'react';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Wrapper from '../../hoc/Wrapper/Wrapper';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
	salad: 3.5,
	cheese: 7.4,
	meat: 10.3,
	bacon: 6.7,
};

class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 10,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false,
	};

	componentDidMount() {
		axios
			.get('https://burger-builder-ce87a.firebaseio.com/ingredients.json')
			.then(res => {
				this.setState({ ingredients: res.data });
			})
			.catch(err => {
				this.setState({ error: true });
			});
	}

	updatePurchable(ingredients) {
		const sumIngredients = Object.keys(ingredients)
			.map(igKey => ingredients[igKey])
			.reduce((acc, cur) => {
				return acc + cur;
			}, 0);

		this.setState({
			purchasable: sumIngredients > 0,
		});
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		// alert("You continued!");
		// this.setState({ loading: true });
		// const order = {
		//   ingredient: this.state.ingredients,
		//   price: this.state.totalPrice,
		//   customer: {
		//     name: "Abhijeet Patil",
		//     address: {
		//       street: "123 main street",
		//       zipcode: "45645",
		//       country: "India",
		//     },
		//     email: "abhi@test.com",
		//     deliveryMode: "fastest",
		//   },
		// };
		// axios
		//   .post("/orders.json", order)
		//   .then((respnse) => this.setState({ loading: false, purchasing: false }))
		//   .catch((error) => this.setState({ loading: false, purchasing: false }));

		const queryParams = [];

		for (let i in this.state.ingredients) {
			queryParams.push(
				encodeURIComponent(i) +
					'=' +
					encodeURIComponent(this.state.ingredients[i])
			);
		}

		queryParams.push('price=' + this.state.totalPrice);

		const queryString = queryParams.join('&');

		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString,
		});
	};

	addIngredientHandler = type => {
		const updatedTotalPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
		const newIngredientValue = this.state.ingredients[type] + 1;
		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = newIngredientValue;

		this.setState({
			ingredients: updatedIngredients,
			totalPrice: updatedTotalPrice,
		});
		this.updatePurchable(updatedIngredients);
	};

	removeIngredientHandler = type => {
		const updatedTotalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

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
		this.updatePurchable(updatedIngredients);
	};

	render() {
		const ingredients = { ...this.state.ingredients };
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

		if (this.state.ingredients) {
			burger = (
				<Wrapper>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						addIngredient={this.addIngredientHandler}
						removeIngredient={this.removeIngredientHandler}
						minLimitDisabled={minLimitDisableInfo}
						maxLimitDisabled={maxLimitDisableInfo}
						purchasable={!this.state.purchasable}
						price={this.state.totalPrice}
						clicked={this.purchaseHandler}
					/>
				</Wrapper>
			);

			orderSummary = (
				<OrderSummary
					ingredients={this.state.ingredients}
					price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);
