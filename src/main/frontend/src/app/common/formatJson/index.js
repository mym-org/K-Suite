import React from 'react'
import PropTypes from 'prop-types';
import css from './index.modules.scss';
import JSONTree from 'react-json-tree';
import theme from './theme';

function FormatJson({ result }) {
  return (
    <div className={css.formatJson}>
      <div className={css.inner}>
        {result ? (
          <JSONTree
            data={result}
            theme={theme}
            shouldExpandNode={() => {
              return true;
            }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
FormatJson.propTypes = {
  result: PropTypes.object
};
export default FormatJson;