const styles = ({ palette }) => ({
  root: {
    margin: '10px 0 10px 0',
  },

  body: {
    border: '1px solid',
    borderColor: '#bdbdbd',
    borderRadius: '5px',
    '&:hover': {
      borderColor: '#424242',
    },
    '&[error="true"]': {
      borderColor: '#f44336',
    },
  },

  legend: {
    padding: '0 5px 0 5px',
    fontSize: '12px',
    color: '#757575',
    '&[error="true"]': {
      color: '#f44336',
    },
  },

  preview: {
    height: '450px',
    width: '600px',
    border: '1px solid',
    borderColor: '#bdbdbd',
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
    color: '#9e9e9e',
  },

  placeholder: {
    color: '#757575',
  },

  input: {
    position: 'absolute',
    top: '0',
    opacity: '0',
  },

  error: {
    margin: '5px 0 0 15px',
    fontSize: '12px',
    color: '#9e9e9e',
    '&[error="true"]': {
      color: '#f44336',
    },
  },
});

export default styles;
