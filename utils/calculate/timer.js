module.exports = {
    convertArr (mss) {
        /**
         * 毫秒（时长）转数组
         * @param {String | Number} mss
         * @return {Array} [时,分,秒]
         */
        return [
            parseInt(mss/1000/60/60),
            parseInt(mss%(1000*60*60)/(1000*60)),
            parseInt(mss%(1000*60)/1000)
        ];
    },
    Countdown (arr, cb) {
        /**
         * 倒计时
         * @param {Array} arr 数组[时,分,秒]
         * @param {Function} cb 回调函数传出数组[时,分,秒]
         * @returns {Function} timer
         */
        const timer = setInterval(() => {
            arr[2] = --arr[2];
            if(arr[2] < 0){
                arr[2] = 59;
                arr[1] = --arr[1];
                if(arr[1] < 0){
                    arr[1] = 59;
                    arr[0] = --arr[0];
                    if(arr[0] < 0){
                        clearInterval(timer);
                        return;
                    }
                }
            }
            for(let i=0; i<arr.length; i++){
                if(typeof arr[i] != 'string' && arr[i] < 10){
                    arr[i] = '0' + arr[i].toString()
                }else if(arr[i] >= 10){
                    arr[i] = arr[i].toString()
                }
            }
            cb(arr)
        }, 1000);
        return timer;
    },
    clearCountdown (timer) {
        /**
         * 手动结束Countdown倒计时
         */
        clearInterval(timer);
    }
}