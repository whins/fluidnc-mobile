<template>
  <div class="flex flex-col h-full gap-2">
    <!-- <StatusBar />
    <ControlPanel />
    <SwipeJog />
    <JogPad /> -->
    <router-view />
  </div>
</template>

<script >
import StatusBar from './components/StatusBar.vue'
import JogPad from './components/JogPad.vue'
import ControlPanel from './components/ControlPanel.vue'
import SwipeJog from './components/SwipeJog.vue'

export default {
  components: {
    StatusBar,
    JogPad,
    SwipeJog,
    ControlPanel
  },
  data: () => ({
    newLabel: '',
    stats: [
      { label: 'A', value: 100 },
      { label: 'B', value: 100 },
      { label: 'C', value: 100 },
      { label: 'D', value: 100 },
      { label: 'E', value: 100 },
      { label: 'F', value: 100 }
    ]
  }),
  methods: {
    add(e) {
      e.preventDefault()
      if (!this.newLabel) return
      this.stats.push({
        label: this.newLabel,
        value: 100
      })
      this.newLabel = ''
    },
    remove(stat) {
      if (this.stats.length > 3) {
        this.stats.splice(this.stats.indexOf(stat), 1)
      } else {
        alert("Can't delete more!")
      }
    }
  }
}
</script>
