import {inject, Injectable} from '@angular/core';
import {OrderApiService} from "./order-api.service";
import {PriceApiService, TPrice} from "./websocket.service";
import {OrderGroup, Order} from "./order.model";
import {BehaviorSubject, map, switchMap } from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
	providedIn: 'root',
})
export class OrderService {
  private removedGroups = new BehaviorSubject<OrderGroup['symbol'][]>([]);
  private removedOrders = new BehaviorSubject<Order['id'][]>([]);
	private orderApiService = inject(OrderApiService);
	private priceApiService = inject(PriceApiService);
	private snackBarService = inject(MatSnackBar);

  public getOrdersBySymbol = () => {
    return this.orderApiService.getOrderData().pipe(
      switchMap((orders) => this.priceApiService.getPrices().pipe(map((prices) => ({
        orders, prices
      })))),
      switchMap(({ orders, prices }) => this.removedOrders.pipe(map((ids) => ({
        orders: orders.filter(order => !ids.find((id) =>  id === order.id)),
        prices,
      })))),
      map(({ orders, prices }) => this.mapPricesToOrders(prices, orders)),
      map((orders) => this.groupOrdersBySymbol(orders)),
      switchMap((groups) => this.removedGroups.pipe(map((symbols) => groups.filter(group => !symbols.find((symbol) =>  symbol === group.symbol))))),
    );
  }

  public removeGroup = (group: OrderGroup) => {
    const closedOrderIds = group.orders.map(order => order.id);
    this.removedGroups.next([...this.removedGroups.value, group.symbol]);
    this.snackBarService.open('Zamknięto zlecenia nr ' + closedOrderIds, 'OK', {
    	duration: 2000,
    });
  }

  public removeOrder = (order: Order) => {
    this.removedOrders.next([...this.removedOrders.value, order.id]);
    this.snackBarService.open('Zamknięto zlecenie nr ' + order.id, 'OK', { duration: 2000 });
  }

  private mapPricesToOrders = (prices: TPrice[], orders: Order[]): Order[] => {
    const calculateProfit = (order: Order, prices: TPrice[]) => {
      const price = prices.find(price => price.symbol === order.symbol);

      if (!price) {
        return order.profit;
      }

      return (price.closedPrice - price.openPrice) * order.size
    }

    return orders.map(order => ({
      ...order,
      profit: calculateProfit(order, prices),
    }))
  }

  private groupOrdersBySymbol(orders: Order[]): OrderGroup[] {
    const groups: { [key: Order['symbol'] ]: OrderGroup } = {};

    orders.map(order => {
      if (!groups[order.symbol]) {
        groups[order.symbol] = {
          symbol: order.symbol,
          orders: [],
          openPrice: 0,
          swap: 0,
          profit: 0,
          size: 0,
        };
      }
      groups[order.symbol].orders.push(order);
      groups[order.symbol].openPrice += order.openPrice;
      groups[order.symbol].swap += order.swap;
      groups[order.symbol].profit += (order.closePrice - order.openPrice) * order.size;
      groups[order.symbol].size += order.size;
    });

    return Object.values(groups).map(group => {
      return {
        ...group,
        openPrice: group.openPrice / group.orders.length,
        profit: group.profit / group.orders.length,
      };
    });
  }
}
