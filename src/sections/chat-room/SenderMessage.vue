<script setup>
import { socket } from '@/services/socket/socket'
import { useChatRoomStore } from '@/stores/chat-room'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { onMounted, ref, watch } from 'vue'

dayjs.extend(localizedFormat)

// props
const { textMessage, latestMessageTimestamp, status, messageId } = defineProps(['textMessage', 'latestMessageTimestamp', 'status', 'messageId'])

// store
// chat-room store
const chatRoomStore = useChatRoomStore()
const { handleReadMessage } = chatRoomStore

// state
const markMessageAsReadSocketUpdate = ref(null)

onMounted(() => {
  socket.on('markMessageAsRead', (data) => {
    if (messageId === data?.messageId) {
      markMessageAsReadSocketUpdate.value = data
    }
  })
})

watch(markMessageAsReadSocketUpdate, (data) => {
  handleReadMessage(data?.messageId)
})
</script>

<template>
  <div class="flex flex-col items-end gap-1 pb-2">
    <div class="bg-[#2e74e8] rounded-lg p-2 max-w-xs self-end" style="box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);">
      <p class="text-white text-sm">{{ textMessage }}</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs text-[#111827] self-end">{{ dayjs(latestMessageTimestamp).format('HH.mm') }}</span>
      <div class="relative flex items-center">
        <i :class="`pi pi-check !text-[11px] ${status === 'UNREAD' ? 'text-gray-400' : 'text-[#2e74e8]'}`"></i>
        <i
          :class="`pi pi-check !text-[11px] !absolute right-[3px] ${status === 'UNREAD' ? 'text-gray-400' : 'text-[#2e74e8]'}`"></i>
      </div>
    </div>
  </div>
</template>
