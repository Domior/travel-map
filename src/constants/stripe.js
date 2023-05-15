export const inputOptions = {
  style: {
    base: {
      fontSize: '16px',
      lineHeight: '24px',
      color: '#fff',
    },
    invalid: { color: '#fff' },
  },
};

export const addressInputOptions = {
  appearance: {
    variables: {
      colorPrimary: '#fff',
      borderRadius: 0,
      fontFamily: 'Inter, sans-serif',
      spacingGridRow: '20px',
    },
    rules: {
      '.Label': {
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 'normal',
        color: '#fff',
        marginBottom: '0.25rem',
        lineHeight: '21px',
        opacity: 1,
      },
      '.Input': {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottomColor: '#707070',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: '4px',
        paddingBottom: '8px',
        color: '#fff',
        backgroundColor: '#1b1b1b',
      },
      '.Input--invalid': {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        boxShadow: 'none',
      },
      '.Input:focus': {
        outline: 'none',
        boxShadow: 'none',
      },
      '.Input::placeholder': {
        color: '#707070',
      },
    },
  },
};
