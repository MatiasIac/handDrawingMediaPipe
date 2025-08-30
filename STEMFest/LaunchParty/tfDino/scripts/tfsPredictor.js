async function startPredictor() {
    const signature = await (await fetch("./model/signature.json")).json();
    const outputName = signature.outputs["Confidences"].name;
    const [width, height] = signature.inputs["Image"].shape.slice(1,3);
    const labels = signature.classes["Label"];

    const model = await tf.loadGraphModel('./model/model.json');

    //console.log(signature);

    const webcam = await tf.data.webcam(video);

    const timeoutTime = 200;

    let timeoutId = setTimeout(_predict, timeoutTime);

    async function _predict() {
        clearTimeout(timeoutId);

        if (!model) { 
            timeoutId = setTimeout(_predict, timeoutTime);
            return; 
        }

        const confidence = tf.tidy(() => {
            const image = tf.browser.fromPixels(video);
            const [imgHeight, imgWidth] = image.shape.slice(0,2);
            const normalizedImage = tf.div(image, tf.scalar(255));
            const batchImage = tf.expandDims(normalizedImage);

            if (model) {
                return model.execute({
                    [signature.inputs["Image"].name]: batchImage
                }, outputName).dataSync();
            }
        });

        if (confidence) {
            const results = {
                'Confidences': labels.reduce((returnConfidences, label, idx) => {
                    return {[label]: confidence[idx], ...returnConfidences}
                }, {}
            )};

            const sortedPredictions = Object.entries(results.Confidences).sort((a, b) => b[1] - a[1]).slice(0, 1);

            console.log(sortedPredictions[0][0]);
            CV_ACTION = sortedPredictions[0][0];
            //let text = '';
            //for (const key in results.Confidences) {
            //    if (Object.hasOwnProperty.call(results.Confidences, key)) {
            //        text += `${key}: ${results.Confidences[key]}<br>`;
            //    }
            //}

            //predDiv.innerHTML = text;
            //console.log(results.Confidences.One);
        }

        await tf.nextFrame();

        timeoutId = setTimeout(_predict, timeoutTime);
    }
}