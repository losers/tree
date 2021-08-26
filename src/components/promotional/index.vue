<template>
    <div>
        <DualPage
          :payload="{}"
          :reference="referenceNo"
          v-if="showPromo"
        ></DualPage>
    </div>
</template>

<script>
import Store from "@/store/index";
import DualPage from "@/modals/DualPage";
import {Promotional} from "@/util/constants";

export default {
    name: "Donation",
    props: ["numOfMembers"],
    components: {
        DualPage
    },
    methods: {
        getPromoReferenceByThreshold(threshold){
            for(let PromotionKey in Promotional){
                let Promotion = Promotional[PromotionKey];
                if(Promotion.Threshold === threshold){
                    return Promotion.Reference;
                }
            }
        },
        toShowPromo(threshold){
            for(let PromotionKey in Promotional){
                let Promotion = Promotional[PromotionKey];
                if(Promotion.Threshold === threshold){
                    return Promotion.Name;
                }
            }
        }
    },
    computed : {
        referenceNo: {
            get(){
                return this.getPromoReferenceByThreshold(this.numOfMembers);
            }
        },
        showPromo: {
            get() {
                let PromotionName = this.toShowPromo(this.numOfMembers);
                if(PromotionName){
                    return Store.state.promos[PromotionName];
                }
                return false;
            }
        }
    },
};
</script>