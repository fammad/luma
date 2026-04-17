import cv2
import mediapipe as mp
from blink_detector import calculate_ear, LEFT_EYE, RIGHT_EYE

mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
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

    # Draw eye landmark dots (unchanged from your version)
    for eye_indices in [LEFT_EYE, RIGHT_EYE]:
        for idx in eye_indices:
            lm = landmarks[idx]
            x = int(lm.x * w)
            y = int(lm.y * h)
            cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

    left_ear  = calculate_ear(landmarks, LEFT_EYE, w, h)
    right_ear = calculate_ear(landmarks, RIGHT_EYE, w, h)
    avg_ear   = (left_ear + right_ear) / 2.0


    print(f"EAR: {avg_ear:.3f}")

    cv2.putText(frame, f"EAR: {avg_ear:.3f}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow("Eye Landmarks", frame)

    if cv2.waitKey(1) & 0xFF == ord('w'):
        break

capture.release()
cv2.destroyAllWindows()