import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useFileTreeActionable } from '../../contexts/file-tree-actionable'
import * as eventTracking from '../../../../infrastructure/event-tracking'
import OLButton from '@/features/ui/components/ol/ol-button'
import MaterialIcon from '@/shared/components/material-icon'

export default function FileTreeModalCreateFileMode({ mode, icon, label }) {
  const { newFileCreateMode, startCreatingFile } = useFileTreeActionable()

  const handleClick = () => {
    startCreatingFile(mode)
    eventTracking.sendMB('file-modal-click', { method: mode })
  }

  return (
    <li className={classnames({ active: newFileCreateMode === mode })}>
      <OLButton
        variant="link"
        onClick={handleClick}
        className="modal-new-file-mode"
      >
        <MaterialIcon type={icon} />
        &nbsp;
        {label}
      </OLButton>
    </li>
  )
}

FileTreeModalCreateFileMode.propTypes = {
  mode: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
