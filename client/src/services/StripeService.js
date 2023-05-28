import { stripeInstance } from './index';

export class StripeService {
  /**
   * do payment
   * @param {Object} body
   * @param {number} body.amount
   * @param {string} body.paymentMethodId
   */

  static async pay(body) {
    return stripeInstance.post(`/pay`, body);
  }
}
