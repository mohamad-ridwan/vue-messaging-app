<script setup>
import { theme } from '@/assets/theme';
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button';
import { ref } from 'vue';
import AddNewChat from './AddNewChat.vue';
import { deleteSessionLogin } from '@/storage-management/local-storage/session-login';
import { useRouter } from 'vue-router';
import { usersStore } from '@/stores/users';
import { chatsStore } from '@/stores/chats';
import { useChatRoomStore } from '@/stores/chat-room';

const confirm = useConfirm();
const router = useRouter()

// store
// users store
const userStore = usersStore()
const { setProfile } = userStore
// chat store
const chatStore = chatsStore()
const { setChats } = chatStore
// chat room store
const chatRoomStore = useChatRoomStore()
const { setChatRoom } = chatRoomStore

// state
const confirmState = ref(null)

const showTemplate = (event) => {
  if (confirmState.value) {
    confirmState.value = event.currentTarget
  } else {
    confirmState.value = null
    confirm.close()
  }

  confirm.require({
    target: confirmState.value,
    group: 'templating',
    message: 'Please confirm to proceed moving forward.',
    acceptClass: '!hidden',
    rejectClass: '!hidden',
  });
}

const handleLogout = () => {
  deleteSessionLogin()
  router.push('/login')
  setProfile(null)
  setChats([])
  setChatRoom({})
}
</script>

<template>
  <AddNewChat @click="confirm.close()" />

  <div class="flex flex-col pt-4 px-4 pb-3 gap-5 w-full bg-white">
    <div class="flex w-full justify-between items-center">
      <h1 class="font-bold text-lg">Chats</h1>
      <div class="flex items-center gap-4">
        <Button icon="pi pi-plus" aria-label="Chat" :class="theme.regularBtn" size="small" icon-class="!text-xs"
          @click="showTemplate($event)" />
        <Button icon="pi pi-sign-out" aria-label="Log out"
          class="'rounded-tl-[6px] !rounded-bl-[6px] rounded-tr-[6px] rounded-br-[6px] !bg-transparent hover:!bg-transparent !h-[23px] !w-[23px] justify-center items-center flex cursor-pointer !text-red-700 !outline-none !border-none !p-0"
          size="small" icon-class="!text-xs" @click="handleLogout" />
      </div>
    </div>
    <slot name="search"></slot>
  </div>

</template>
