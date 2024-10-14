<template>
    <div>
        <PageHeader title="AI Chat Bot" />

        <div class="chatbot">
            <ul ref="chatlist">
                <li v-for="(data, i) in messages" :data="data.role"
                    :class="[{ 'animate': data.animate }, { 'unstyle': data.id == 0 }, { 'error': data.id == -1 }, { 'space': i < messages.length - 1 && messages[i + 1].role != data.role }]">
                    <span>
                        <h4 v-if="data.role == 'bot' && data.id != 0" class="mb-1">
                            <Ti icon="mood-happy" class="me-1" /> Varash Bot
                        </h4>
                        <p v-html="data.message" class="m-0"></p>
                        <code>{{ $n.utils.dateFormat(data.created_at, 'H:i') }}</code>
                    </span>
                </li>
            </ul>

            <div class="d-flex justify-content-between align-items-center input">
                <Ti icon="message" />
                <PlainInput hint="Ada yang bisa kami bantu?" :max-length="150" v-model="message" @enter="sendMessage" />
            </div>
        </div>

    </div>
</template>

<script lang="ts">
export default {
    setup() {
        return {}
    },

    data() {
        return {
            message: '',
            messages: <any>[
                {
                    role: 'bot',
                    created_at: new Date(),
                    message: 'Selamat datang, ada yang bisa kami bantu?',
                    animate: true
                },

                // {
                //     id: 0,
                //     role: 'bot',
                //     created_at: new Date(),
                //     message: 'Mengetik',
                //     animate: true
                // },

                // {
                //     id: -1,
                //     role: 'bot',
                //     created_at: new Date(),
                //     message: 'Terjadi kesalahan, mohon maaf belum bisa merespons.',
                //     animate: true
                // }
            ]
        }
    },

    methods: {

        scroll(delay = 0) {
            setTimeout(() => {
                // scroll to the bottom if scroll value is at or near the bottom
                const list = this.$refs.chatlist as HTMLElement;

                const threshold = 50; // distance in pixels from the bottom
                const currentScroll = list.scrollTop + list.clientHeight;
                const maxScroll = list.scrollHeight;

                // Check if the user is close to or at the bottom
                // if (currentScroll >= maxScroll - threshold) {
                list.scrollTo({
                    top: maxScroll,
                    behavior: 'smooth'
                });
                // }
            }, delay);
        },

        async getResponse(message: string) {
            const failed = (message: string | null = null) => {
                this.messages.push({
                    id: -1,
                    role: 'bot',
                    created_at: new Date(),
                    message: message ?? 'Terjadi kesalahan, mohon maaf belum bisa merespons.',
                    animate: true
                })
                this.scroll(50)
            }

            try {
                const res = await fetch('http://127.0.0.1:5000/chat', {
                    method: 'POST', // Send a POST request
                    headers: {
                        'Content-Type': 'application/json' // Send JSON data
                    },
                    body: JSON.stringify({ message: message })
                })


                if (!res.ok) {
                    failed()
                    return
                }

                return await res.json();
            } catch (error) {
                failed(`${error}`)
            }
        },

        sendMessage() {
            const date = new Date()
            const payload = {
                role: 'user',
                created_at: date,
                message: this.message,
                animate: true
            }

            const bot = {
                role: 'bot',
                created_at: date,
                message: 'Mengetik',
                animate: false,
                id: 0
            }

            this.$n.utils.arrDelete(this.messages, (e: any) => e.id == 0)
            this.messages.push(payload)
            this.message = ''
            this.scroll(50)

            setTimeout(() => {
                this.messages.push(bot)

                this.scroll(50)

                setTimeout(() => {
                    // make request
                    this.getResponse(payload.message).then((res) => {
                        // delete message where id = 0
                        this.$n.utils.arrDelete(this.messages, (e: any) => e.id == 0)

                        if (res) {
                            this.messages.push(res)
                            this.scroll(50)
                        }
                    })
                }, 0);
            }, 300);

        }
    }
}
</script>

<style lang="scss" scoped>
.chatbot {
    width: 390px;
    background: white;
    border-radius: 10px;
    height: 550px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .input {
        border: 1px transparent solid;
        padding: 5px 0;
        padding-left: 15px;
        border-radius: 0px;
        overflow: hidden;
        transition: .2s;
        // background-color: #fbfbfb;
        width: calc(100% - 0px);
        position: absolute;
        bottom: 0px;
        left: 0px;
        backdrop-filter: blur(5px);
        border-top: 1px #ddd solid;

        &:has(> input:focus) {
            border-color: #333;
            width: calc(100% - 40px);
            bottom: 20px;
            left: 20px;
            padding-top: 0;
            padding-bottom: 0;
            border-radius: 5px;

            // background-color: #fff;

            i {
                color: #333;
            }
        }

        i {
            position: absolute;
            z-index: 99;
            color: #999;
        }

        input {
            border: 1px transparent solid;
            outline: none;
            padding: 10px 20px;
            background-color: transparent;
            transition: .2s;
            width: 100%;
            padding-left: 30px;
            box-sizing: border-box;
        }
    }

    ul {
        list-style: none;
        padding: 10px 20px;
        padding-bottom: 100px;
        margin: 0;
        height: 100%;
        height: 550px;
        overflow: auto;
        scrollbar-width: none;

        li {
            display: block;
            padding: 2px 0;

            &.space {
                margin-bottom: 15px;
            }

            &[data=user] {
                text-align: end !important;

                span {
                    background-color: #cae7cd;
                }
            }

            span {
                display: inline-block;
                max-width: 80%;
                background-color: #ddd;
                padding: 10px 15px;
                // padding-right: 50px;
                padding-bottom: 15px;
                border-radius: 5px;
                text-align: start;
                position: relative;
                word-break: break-all;
                min-width: 100px;

                code {
                    background: transparent;
                    margin: 0;
                    margin-left: 10px;
                    position: absolute;
                    font-size: 11px;
                    bottom: -1px;
                    right: 5px;
                }
            }

            &.error {
                span {
                    border: 1px rgb(199, 74, 74) solid;
                    background-color: rgb(255, 234, 234);
                    color: rgb(206, 95, 95);
                }
            }

            &.unstyle {
                span {
                    background-color: transparent;
                    padding: 0;
                    color: #888;
                    min-width: auto;

                    code {
                        display: none;
                    }
                }

                animation: dot-animation 2s steps(6, end) infinite;

                @keyframes dot-animation {
                    0% {
                        content: "";
                    }

                    20% {
                        content: " .";
                    }

                    40% {
                        content: " . . ";
                    }

                    60% {
                        content: " . . .";
                    }

                    80% {
                        content: " . . . .";
                    }

                    100% {
                        content: " . . . . .";
                    }
                }

                &::after {
                    content: "";
                    animation: dot-animation 2s steps(6, end) infinite;
                }
            }


            &.animate {
                animation: slideUpScaleUp 0.2s ease-out forwards;

                @keyframes slideUpScaleUp {
                    0% {
                        transform: translateY(100%) scale(0.5); // mulai dari bawah dan ukuran kecil
                        opacity: 0;
                    }

                    100% {
                        transform: translateY(0) scale(1); // posisi di tempat dan ukuran normal
                        opacity: 1;
                    }
                }
            }


        }
    }
}
</style>