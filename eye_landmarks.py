import cv2
import mediapipe as mp

#Fixed Reference Points for left and right eye points
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
    )

capture = cv2.VideoCapture(0)


while capture.isOpened():
    ok, frame = capture.read()

    if not ok:
        break
    
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        cv2.imshow("Eye Landmarks", frame)
        if cv2.waitKey(1) & 0xFF == ord('w'):
            break
        continue

    landmarks = results.multi_face_landmarks[0].landmark
    h, w = frame.shape[:2]

    for eye_indices in [LEFT_EYE, RIGHT_EYE]:
        for idx in eye_indices:
            lm = landmarks[idx]
            x = int(lm.x * w)
            y = int(lm.y * h)
            cv2.circle(frame, (x, y), 2, (0,255, 0), -1)

    cv2.imshow("Eye Landmarks", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('w'):
        break

capture.release()
cv2.destroyAllWindows()
