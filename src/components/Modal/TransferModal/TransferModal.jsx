import './TransferModal.scss'
import '../Modal.scss'
import InputField from '../../InputField/InputField'
import SelectReact from '../../SelectReact/SelectReact'
import Button from '../../Button/Button'
import ButtonClose from '../../ButtonClose/ButtonClose'
import { createPortal } from 'react-dom'
import { getToken } from '../../../utils/tokenActions'
import { useDispatch } from 'react-redux'
import { getUserOrders } from '../../../store/order/orderActions'
import ordersAPI from '../../../api/ordersAPI'
import { customerStylesSelect } from '../../../assets/styles/customerStylesSelect'
import { TIME_OPTIONS } from '../../../constants/constants'

function TransferModal({ order, show, closeModal }) {
  const dispatch = useDispatch()

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const token = getToken()
    const formData = new FormData(form)
    const formJson = Object.fromEntries(formData.entries())
    await ordersAPI.updateOrder(order, token, { cleaning_date: formJson.date, cleaning_time: formJson.time })
    dispatch(getUserOrders())
    closeModal()
  }

  if (!show) return null
  return (
    <>
      {createPortal(
        <section className="modal">
          <div onClick={closeModal} className="modal__overlay" />
          <form onSubmit={handleSubmit} action="" className="modal__form">
            <ButtonClose closeModal={closeModal} />
            <div className="modal__content">
              <h2 className="form-transfer__title text-l">Выберите новую дату и время уборки</h2>
              <div className="form-transfer__input-container">
                <InputField
                  name={'date'}
                  classNameModal="form-transfer__date"
                  size="small"
                  focus
                  label="Дата"
                  placeholder="__/__/____"
                />
                <div className="form-transfer__select">
                  <label>Время</label>
                  <SelectReact styles={customerStylesSelect} time="time" options={TIME_OPTIONS} />
                </div>
              </div>
              <Button buttonText="Перенести" buttonClassName="button button__modal-indent" />
            </div>
          </form>
        </section>,
        document.getElementById('root'),
      )}
    </>
  )
}

export default TransferModal
