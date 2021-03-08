import React, { Component } from 'react';
import axios from '../../../axios-orders';
import Order from '../../../components/Order/Order';
import Spinner from '../../../components/UI/Spinner/Spinner';

class Orders extends Component {
	state = {
		orders: [],
		loading: true,
	};

	componentDidMount() {
		axios
			.get('/orders.json')
			.then(res => {
				const fetchedOrders = [];

				for (let key in res.data) {
					fetchedOrders.push({
						...res.data[key],
						id: key,
					});
				}

				this.setState({ orders: fetchedOrders, loading: false });
			})
			.catch(error => this.setState({ loading: false }));
	}

	render() {
		let orders = this.state.orders.map(order => (
			<Order
				key={order.id}
				ingredients={order.ingredients}
				price={order.price}
			/>
		));

		if (this.state.loading) {
			orders = <Spinner />;
		}
		return orders;
	}
}

export default Orders;
