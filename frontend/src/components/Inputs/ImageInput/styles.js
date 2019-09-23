const styles = ({ palette }) => ({
  root: {
    margin: '10px 0 10px 0',
  },

  body: {
    border: '1px solid',
    borderColor: palette.secondary.dark,
    borderRadius: '5px',
    '&:hover': {
      borderColor: palette.secondary.light,
    },
    '&[error="true"]': {
      borderColor: palette.error.dark,
    },
  },

  legend: {
    padding: '0 5px 0 5px',
    fontSize: '12px',
    color: palette.secondary.dark,
    '&[error="true"]': {
      color: palette.error.dark,
    },
  },

  preview: {
    height: '450px',
    width: '600px',
    border: '1px solid',
    borderColor: palette.secondary.dark,
    borderRadius: '5px',
  },

  image: {
    maxWidth: '600px',
    maxHeight: '450px',
    display: 'block',
    margin: 'auto',
    '&[src=""]': {
      display: 'none',
    },
  },

  uploadArea: {
    display: 'block',
    overflow: 'hidden',
    fontSize: '1em',
    height: '50px',
    lineHeight: '50px',
    width: '600px',
    cursor: 'pointer',
  },

  button: {
    height: '100%',
    float: 'right',
    color: palette.secondary.main,
  },

  placeholder: {
    color: palette.secondary.main,
  },

  input: {
    position: 'absolute',
    top: '0',
    opacity: '0',
  },

  error: {
    margin: '5px 0 0 15px',
    fontSize: '12px',
    color: palette.secondary.dark,
    '&[error="true"]': {
      color: palette.error.dark,
    },
  },
});

export default styles;
