import React, { Component } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native-web";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import numeral from "numeral";

import { fontSize, colors } from "./styles";

const ExchangeRateQuery = gql`
  query rates($currency: String!) {
    rates(currency: $currency) {
      currency
      rates {
        currency
        rate
      }
    }
  }
`;

const ExchangeRateList = ({
  currency: currentCurrency,
  onCurrencyChange,
  rates,
  error,
  loading
}) => (
  <View style={styles.container}>
    {loading ? (
      <ActivityIndicator color={colors.teal} />
    ) : rates ? (
      rates
        .filter(
          ({ currency }) =>
            currency !== currentCurrency &&
            ["USD", "BTC", "LTC", "EUR", "JPY", "ETH", "TWD"].includes(currency)
        )
        .map(({ currency, rate }, idx, rateArr) => (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onCurrencyChange(currency)}
            style={[
              styles.currencyWrapper,
              idx === rateArr.length - 1 && { borderBottomWidth: 0 }
            ]}
            key={currency}
          >
            <Text style={styles.currency}>{currency}</Text>
            <Text style={styles.currency}>
              {rate > 1 ? numeral(rate*.828).format("0,0.00") : rate*.828}
            </Text>
          </TouchableOpacity>
        ))
    ) : (
      <Text>{error && `An error has occurred: ${error}`}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20
  },
  currencyWrapper: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.teal
  },
  currency: {
    fontSize: fontSize.medium,
    fontWeight: 100,
    color: colors.grey,
    letterSpacing: 4
  }
});

export default graphql(ExchangeRateQuery, {
  props: ({ data }) => {
    if (data.loading) {
      return {
        loading: data.loading
      };
    }

    if (data.error) {
      return {
        error: data.error
      };
    }

    return {
      loading: false,
      rates: data.rates.rates
    };
  }
})(ExchangeRateList);
