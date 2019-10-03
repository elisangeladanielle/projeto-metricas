<template>
  <div>
    <div class="months-navigation">
      <div
        :key="i"
        id="month-link"
        class="month-link"
        @click="setActiveMonth(month)"
        v-for="(month, i) in groupedMonths"
        :class="{active: month.month == activeMonth.month}"
      >
        <div class="month-label">{{ month.month }}</div>
        <div id="value-label" class="value-label">{{ month.total }}</div>
      </div>
    </div>
    <div class="container-group">
      <div class="container">
        <div v-if="activeMonth.data && !activeMonth.data.length">
          Você não cadastrou nenhuma atividade neste mês.
        </div>
        <template v-else>
          <activity-list-item
            :key="index"
            :data="item"
            v-for="(item, index) in activeMonth.data"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import groupBy from 'lodash.groupby'
import ActivityListItem from './ActivityListItem'

export default {
  name: 'ListaAtividades',
  components: {
    ActivityListItem
  },
  data: () => ({
    atividades: [],
    activeMonth: {}
  }),
  created () {
    this.getData()
  },
  mounted () {
    this.setActiveMonth()
  },
  computed: {
    groupedMonths () {
      let groupedMonths = []

      const addCurrentMonth = () => {
        groupedMonths.push({
          data: [],
          total: 0,
          month: moment().format('MM/YYYY')
        })
      }

      if (this.atividades.length) {
        const months = groupBy(this.atividades, i => (
          moment(i.creatat).format('MM/YYYY')
        ))

        const sortedMonths = Object.keys(months).sort((a, b) => {
          const pattern = 'MM/YYYY HH'

          return moment(`${a} 01`, pattern).isBefore(moment(`${b} 01`, pattern))
            ? -1
            : +1
        })

        groupedMonths = sortedMonths.map(month => ({
          month,
          data: months[month],
          total: months[month].map(i => +i.value).reduce((a, c) => a + c, 0)
        }))

        const lastMonth = moment(groupedMonths[groupedMonths.length - 1].month, 'MM/YYYY')

        if (!lastMonth.isSame(moment(), 'month')) {
          addCurrentMonth()
        }
      } else {
        addCurrentMonth()
      }

      return groupedMonths
    }
  },
  methods: {
    getData () {
      const ref = this.$firebase.database().ref(`/${window.uid}`)

      ref.on('value', snapshot => {
        const values = snapshot.val()
        this.atividades = Object.keys(values).map(i => values[i])
      })
    },
    setActiveMonth (month = null) {
      this.activeMonth = month || this.groupedMonths[this.groupedMonths.length - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
  .months-navigation {
    display: flex;
    margin-left: -15px;
    width: calc(100% + 30px);
    background-color: var(--featured-dark);
    .month-link {
      padding: 15px;
      cursor: pointer;
      transition: .4s;
      text-align: center;
      &:hover {
        background-color: var(--featured);
      }
      &.active {
        background-color: var(--featured);
      }
      .value-label {
        color: var(--darker);
        font-size: 8pt;
      }
    }
  }

.container-group {
  margin-left: -15px;
  overflow: hidden auto;
  width: calc(100% + 30px);
  height: calc(100vh - 69px);
  .container {
    font-size: 15pt;
    padding-top: 12px;
    padding-bottom: 15px;
  }
}
</style>>
