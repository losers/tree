<template>
    <div class="con">
        <center>
            <div v-if="paymentProcessing">
                <div
                class="spinner-border spinner-border-sm"
                style="width: 3.5rem; height: 3.5rem; color: green;"
                ></div>
                <h4 class="processing">Processing your Payment</h4>
            </div>
            <div v-else>
                <tick></tick>
                <h4 class="processing">Payment Success</h4>
                <h5 class="sub">Thank you</h5>
                <h6 class="redirect">You will be redirected to bloodline. if not redirected <a class="click-here">click here.</a></h6>
            </div>
        </center>
    </div>
</template>
<style scoped>
    .redirect{
        margin-top: 100px;
        color: grey;
        font-size: 12px;
    }

    .redirect .click-here{
        color: blue;
        text-decoration: underline;
    }
    .sub{
        color: grey;
        font-size: 14px;
    }
    .con{
        padding-top: 200px;
    }
    .processing{
        color: black;
        margin-top: 20px;
    }
</style>
<script>
import ProdData from "@/data.js";
import Axios from "axios";
import Tick from "@/components/small/tick";
export default {
    name: "Payment",
    components: {Tick},
    data(){
        return {
            paymentProcessing: true
        }
    },
    mounted(){
        if (this.$route.query.paymentId && this.$route.query.PayerID) {
            let url = `${ProdData.getHostURL()}/pay/${this.$route.params.id}`;
            url = `${ProdData.getHostURL()}/pay/test`;
            let params = {
                payment_id: this.$route.query.paymentId,
                payer_id: this.$route.query.PayerID
            };
            Axios.put(url, params)
            .then(data => {
                setTimeout(() => {
                    this.$router.push({ name: "MainTree", params: { id: data.data.surname } });
                }, 5000);
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.paymentProcessing = false;
            });
        }
    }
}
</script>
