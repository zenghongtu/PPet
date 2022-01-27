import React from 'react'
import styled from 'styled-components'
import { AppstoreOutlined, DragOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Wrapper = styled.div``

const DragIcon = styled(DragOutlined)`
  -webkit-app-region: drag;
  cursor: move;
`
const Toolbar = () => {
  return (
    <Wrapper>
      <DragIcon />
      <Link target={'__blank'} to="/store">
        <AppstoreOutlined />
      </Link>
    </Wrapper>
  )
}

export default Toolbar
