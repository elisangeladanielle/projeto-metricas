<template>
  <div>
    <h1>Dashboard</h1>
    <mdb-container>
      <mdb-line-chart :data="lineChartData" :options="lineChartOptions" :width="1000" :height="600"></mdb-line-chart>
    </mdb-container>
  </div>
</template>

<script>
import { mdbLineChart, mdbContainer } from 'mdbvue'
import moment from 'moment'
import groupBy from 'lodash.groupby'
import database from 'firebase'
import ActivityListItem from '../../pages/lista-atividades/ActivityListItem'
import ListaAtividades from '../../pages/lista-atividades/ListaAtividades'

  export default {
    name: 'ChartPage',
    components: {
      mdbLineChart,
      mdbContainer,
      ActivityListItem,
      ListaAtividades
    },
    data() {
      return {
        atividades: [],
        activeMonth: {},
        lineChartData: {
          labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho"],
          datasets: [
            {
              label: 'Quantidade de atividades / Meses',
              backgroundColor: "rgba(151,187,205,0.2)",
              borderColor: "rgba(255, 255, 255, 1.0)",//"rgba(151,187,205,1)",
              borderWidth: 0.7,
              data: []
            },
            {
              label: "Atividades por mês",
              backgroundColor: "rgba(153,51,153,1)",//"rgba(255,140,0,0.6)",//"rgba(255,127,0.8)",//"rgba(255, 99, 132, 0.1)",
              borderColor: "rgba(255, 255, 255, 1.0)",//"rgba(360,0,1,1)",//"rgba(255, 99, 132, 1)",
              borderWidth: 0.8,
              data: []
            }
          ]
        },

        lineChartOptions: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)"
              }
            }],
            yAxes: [{
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)"
              }
            }]
          }
        }
      };
    },
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

        this.lineChartData = {
          ...this.lineChartData,
          datasets: [
            ...this.lineChartData.datasets.map((d, i) => {
              if (i === 1) {
                return {
                  ...d,
                  data: groupedMonths.map(g => g.total)
                }
              }
              else
                return d;
            })
          ]
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

<style scoped lang="scss">

</style>
