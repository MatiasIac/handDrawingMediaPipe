import cv2
import mediapipe as mp
import numpy as np

def cleanImage(image):
    image[:] = 255

def pasteOverlay(back, image, x, y):
    back[y:y + image.shape[0], x:x + image.shape[1]] = image

def pasteWeighted(back, weigthed, output):
    cv2.addWeighted(back, 0.3, weigthed, 0.7, 0.0, output)

def isPontingWithIndex(landmarks):
    return (landmarks[8].y < landmarks[6].y) \
        and (landmarks[12].y > landmarks[10].y) \
            and (landmarks[16].y > landmarks[14].y) \
                and (landmarks[20].y > landmarks[18].y)

def selectTemplate(currentPos, to, max):
    currentPos += to
    currentPos = currentPos % max
    return currentPos

def overlay_transparent(background_img, img_to_overlay_t, x, y, overlay_size=None):
	bg_img = background_img.copy()
	
	if overlay_size is not None:
		img_to_overlay_t = cv2.resize(img_to_overlay_t.copy(), overlay_size)

	b,g,r,a = cv2.split(img_to_overlay_t)
	overlay_color = cv2.merge((b,g,r))
	
	mask = cv2.medianBlur(a,5)

	h, w, _ = overlay_color.shape
	roi = bg_img[y:y+h, x:x+w]

	img1_bg = cv2.bitwise_and(roi.copy(),roi.copy(),mask = cv2.bitwise_not(mask))
	img2_fg = cv2.bitwise_and(overlay_color,overlay_color,mask = mask)
	bg_img[y:y+h, x:x+w] = cv2.add(img1_bg, img2_fg)
	return bg_img

def printHud():
    for index, color in enumerate(colorList):
        point = (index * 60) + 5
        pointX = (point, 0)
        pointY = (point + 50, 50)
        cv2.rectangle(background, pointX, pointY, color, -1)
        cv2.rectangle(background, pointX, pointY, (0, 0, 0, 255), 1)

def rectColliding(x, y, w, h, x1, y1, w1, h1):
    return x < x1 + w1 and \
            x + w > x1 and \
            y < y1 + h1 and \
            y + h > y1

def selectColor(x, y, currentColor):
    finalColor = currentColor

    for index, color in enumerate(colorList):
        point = (index * 60) + 5

        if rectColliding(x, y, 2, 2, point, 0, 50, 50):
            finalColor = color

    return finalColor

def swapTemplate(x, y, isOver):
    mustSwap = 0
    collideRight = rectColliding(x, y, 2, 2, 1230, 335, 50, 70)
    collideLeft = rectColliding(x, y, 2, 2, 0, 335, 50, 70)
    
    if collideRight and not isOver:
        mustSwap = 1
    
    if collideLeft and not isOver:
        mustSwap = -1

    return collideLeft or collideRight, mustSwap

colorList = [
    (255, 255, 255, 255), 
    (0,0,0), 
    (255,0,0), 
    (0,255,0), 
    (0,0,255), 
    (255,255,0), 
    (0,255,255), 
    (255,0,255),
    (192,192,192),
    (128,128,128),
    (128,0,0,255),
    (128,128,0),
    (0,128,0),
    (128,0,128),
    (0,128,128),
    (0,0,128)]

selectedColor = colorList[1]

isOverActionButton = False
width, height = 1280, 720
canvasX, canvasY = 320, 120
totalTemplates = 6
linePointX, linePointY = -1, -1
templates = []
currentTemplate = 0
buttonRight, buttonLeft = cv2.imread('./images/buttonRight.png', -1), cv2.imread('./images/buttonLeft.png', -1)

tempImage = np.zeros((480, 640, 3), np.uint8)
tempCanvas = np.zeros((480, 640, 3), np.uint8)
mergeCanvas = np.zeros((480, 640, 3), np.uint8)
background = np.zeros((height, width, 3), np.uint8)

cleanImage(background)
cleanImage(mergeCanvas)
cleanImage(tempCanvas)

for i in range(totalTemplates + 1):
    img = cv2.imread(f'./images/{i}.png')
    templates.append(img)

tempImage = templates[currentTemplate].copy()

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

mpHands = mp.solutions.hands
mpDraw = mp.solutions.drawing_utils
hands = mpHands.Hands(False, 1, 0.5, 0.5)

while True:
    cleanImage(background)

    printHud()
    background = overlay_transparent(background, buttonRight, width - 50, 335)
    background = overlay_transparent(background, buttonLeft, 0, 335)

    pasteOverlay(background, mergeCanvas, canvasX, canvasY)
    pasteWeighted(tempImage, tempCanvas, mergeCanvas)

    success, camImg = cap.read()
    camImgRGB = cv2.cvtColor(camImg, cv2.COLOR_BGR2RGB)
    results = hands.process(camImgRGB)

    if results.multi_hand_landmarks:
        for handLandmarks in results.multi_hand_landmarks:
            indexFinger = handLandmarks.landmark[8]
            indexX, indexY = int(indexFinger.x * width), int(indexFinger.y * height)

            selectedColor = selectColor(indexX, indexY, selectedColor)
            isOverActionButton, swapValue = swapTemplate(indexX, indexY, isOverActionButton)

            if swapValue != 0:
                currentTemplate = selectTemplate(currentTemplate, swapValue, totalTemplates + 1)
                tempImage = templates[currentTemplate].copy()
                cleanImage(mergeCanvas)
                cleanImage(tempCanvas)

            mpDraw.draw_landmarks(background, handLandmarks, mpHands.HAND_CONNECTIONS)

            cv2.circle(background, (indexX, indexY), 5, selectedColor, cv2.FILLED)

            paintX, paintY = indexX - canvasX, indexY - canvasY

            if isPontingWithIndex(handLandmarks.landmark) and (paintX >= 0 and paintY >= 0):
                if linePointX == -1:
                    linePointX, linePointY = paintX, paintY

                cv2.line(tempCanvas, (linePointX, linePointY), (paintX, paintY), selectedColor, thickness=5)
                linePointX, linePointY = paintX, paintY
            else:
                linePointX, linePointY = -1, -1

    background = cv2.flip(background, 1)

    cv2.imshow("Painter", background)
    cv2.waitKey(1)

cv2.destroyAllWindows()