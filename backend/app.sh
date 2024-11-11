# DELETE ASSETS UPLOAD FROM SERVER
# folder public/uploads/avatars
# folder public/uploads/certificates
# folder public/uploads/decrees


folders=("public/uploads/avatars" "public/uploads/certificates" "public/uploads/decrees")

echo "CLEANING FOLDERS 🧹..."
for folder in "${folders[@]}"; do
  if [ -d "$folder" ]; then
    rm -f "$folder"/*
    echo "$folder clean ✨"
  else
    echo "Directory $folder does not exist."
  fi
done

