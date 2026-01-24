import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

// Helper to search for a folder or create it
async function ensureFolder(accessToken: string, folderName: string): Promise<string> {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    const res = await fetch(searchUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
    const data = await res.json();

    if (data.files && data.files.length > 0) {
        return data.files[0].id;
    }

    // Create folder
    const metadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
    };

    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
    });

    const createData = await createRes.json();
    return createData.id;
}

/**
 * Uploads a JSON string to Google Drive (Impact Log Backups/"ImpactLog_Backup_DATE.json")
 * Creates a NEW file with timestamp every time (History/Versioning).
 */
export async function uploadToGoogleDrive(data: object): Promise<string> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope(DRIVE_SCOPE);

    let accessToken: string | null = null;

    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        accessToken = credential?.accessToken || null;
    } catch (error) {
        console.error("Error getting Drive permission:", error);
        throw new Error("Drive Permission Denied");
    }

    if (!accessToken) {
        throw new Error("Failed to get Access Token");
    }

    // 1. Ensure Folder Exists
    const folderId = await ensureFolder(accessToken, "Impact Log Backups");

    // 2. Create Unique Filename
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16); // YYYY-MM-DD-THH-mm
    const fileName = `ImpactLog_Backup_${dateStr}.json`;
    const fileContent = JSON.stringify(data, null, 2);
    const fileType = "application/json";

    // 3. Upload (Create New File always)
    const metadata = {
        name: fileName,
        mimeType: fileType,
        parents: [folderId]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileContent], { type: fileType }));

    const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

    const uploadRes = await fetch(uploadUrl, {
        method: "POST", // Always create new
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form
    });

    if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`Upload Failed: ${errorText}`);
    }

    const result = await uploadRes.json();
    return result.id;
}
