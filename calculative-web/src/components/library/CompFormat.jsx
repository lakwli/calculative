import React from 'react';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';

const MoneyFormatCustom = React.forwardRef(function MoneyFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

MoneyFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const currentYear = new Date().getFullYear();
const YearFormatCustom = React.forwardRef(function YearFormatCustom(props, ref) {
  const validateYear = (value) => {
    if (value.length === 1) {
      return ['1', '2'].includes(value);
    }
    if (value.length === 2) {
      return (value[0] === '1' && ['9'].includes(value[1])) ||
             (value[0] === '2' && ['0'].includes(value[1]));
    }
    if (value.length === 3) {
      return (value[0] === '1' && value[1] === '9' && '0123456789'.includes(value[2])) ||
             (value[0] === '2' && value[1] === '0' && '0123'.includes(value[2]));
    }
    if (value.length === 4) {
      const year = parseInt(value, 10);
      return year >= 1900 && year <= currentYear;
    }
    return value.length < 4;  // Allow backspacing
  };

  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
          onChange({            
              target: {
              name: props.name,
              value: values.value,
              },
          });
      }}
      valueIsNumericString={false}
      isAllowed={({ value }) => validateYear(value)}

    />
  );
});


YearFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};


const Number2DigitFormatCustom = React.forwardRef(function Number2DigitFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
          onChange({            
              target: {
              name: props.name,
              value: values.value,
              },
          });
      }}
      valueIsNumericString={false}
      isAllowed={({ value }) => {
          return value.length <= 2;
        }}
    />
  );
});


Number2DigitFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const Number1DigitFormatCustom = React.forwardRef(function Number2DigitFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
          onChange({            
              target: {
              name: props.name,
              value: values.value,
              },
          });
      }}
      valueIsNumericString={false}
      isAllowed={({ value }) => {
          return value.length <= 1;
        }}
    />
  );
});


Number2DigitFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const PercentageFormatCustom = React.forwardRef(function PercentageFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
            onChange({            
                target: {
                name: props.name,
                value: values.value,
                },
            });
        }}
        decimalScale={1}
        fixedDecimalScale
        valueIsNumericString
        suffix="%"
        isAllowed={({ value }) => {
            const [integerPart, decimalPart] = value.split('.');
            return integerPart.length <= 2 && (decimalPart ? decimalPart.length <= 1 : true);
          }}
      />
    );
  });

  
PercentageFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const PercentageNoDecimalFormatCustom = React.forwardRef(function PercentageNoDecimalFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
          onChange({            
              target: {
              name: props.name,
              value: values.value,
              },
          });
      }}
      decimalScale={0}
      fixedDecimalScale
      valueIsNumericString
      suffix="%"
      isAllowed={({ value }) => {
          const [integerPart, decimalPart] = value.split('.');
          return integerPart.length <= 2 && (decimalPart ? decimalPart.length <= 1 : true);
        }}
    />
  );
});


PercentageNoDecimalFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


export { MoneyFormatCustom, PercentageFormatCustom,PercentageNoDecimalFormatCustom, Number2DigitFormatCustom, YearFormatCustom,Number1DigitFormatCustom };
