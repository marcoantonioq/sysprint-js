import dayjs from 'dayjs'

export default function (context, inject) {
  inject('dayjs', dayjs)
}
