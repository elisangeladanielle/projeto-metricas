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
    name: 'LayoutDashboard',
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
          // labels: [],
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

        const dateRange = (startDate, endDate) => {
          var start      = startDate.split('/');
          var end        = endDate.split('/');
          var startYear  = parseInt(start[1]);
          var endYear    = parseInt(end[1]);
          var dates      = [];
          var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          var arrMonthNames = [];

          for(var i = startYear; i <= endYear; i++) {
            var endMonth = i != endYear ? 11 : parseInt(end[0]) - 1;
            var startMon = i === startYear ? parseInt(start[0])-1 : 0;
            for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
              var month = j+1;
              var displayMonth = month < 10 ? '0'+month : month;
              dates.push([displayMonth, i].join('/'));
              arrMonthNames.push(monthNames[month - 1]);
            }
          }
          return { dates: dates, arrMonthNames: arrMonthNames };
        }

        const arrMonthMap = groupedMonths.map(m => m.month);
        const dates = dateRange(arrMonthMap[0], arrMonthMap[arrMonthMap.length - 1]);
        const copy = JSON.parse(JSON.stringify(groupedMonths));
        let arr = [];

        dates.dates.forEach((elem, i) => {
          const findMonth = copy.find(m => m.month === elem);

          if (findMonth)
            arr.push(findMonth);
          else
            arr.push({ month: elem, data: [], total: 0 });
        });

        groupedMonths = arr;

        console.log(groupedMonths);

        this.lineChartData = {
          ...this.lineChartData,
          labels: dates.arrMonthNames,
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
