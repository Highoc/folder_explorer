from rest_framework import serializers

from .models import Folder, Image


class FolderSerializer(serializers.ModelSerializer):
    parent_folder_key = serializers.CharField(write_only=True, allow_null=True)

    def validate_parent_folder_key(self, value):
        try:
            if value is None:
                return None
            else:
                return Folder.objects.get(key=value)

        except Folder.DoesNotExist:
            raise serializers.ValidationError('Incorrect folder key')

    def create(self, validated_data):
        folder = Folder(
            name=validated_data['name'],
            parent_folder=validated_data['parent_folder_key'],
        )
        folder.save()
        return folder

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

    class Meta():
        model = Folder
        fields = ('name', 'parent_folder_key')


class ImageSerializer(serializers.ModelSerializer):
    folder_key = serializers.CharField(write_only=True)

    def create(self, validated_data):
        image = Image(
            name=validated_data['name'],
            description=validated_data['description'],
            folder=validated_data['folder_key'],
            mime=validated_data['content'].content_type,
        )

        image.save()
        image.content.save(image.key.hex, validated_data['content'])

        return image

    def validate_content(self, value):
        if value.content_type not in ['image/png', 'image/jpeg']:
            raise serializers.ValidationError('Wrong image mime-type')

        if value.size > 10*1024*1024:
            raise serializers.ValidationError('Size of image must be less than 10MB')

        return value

    def validate_folder_key(self, value):
        try:
            return Folder.objects.get(key=value)

        except Folder.DoesNotExist:
            raise serializers.ValidationError('Incorrect folder key')

    class Meta():
        model = Image
        fields = ('name', 'description', 'content', 'folder_key')
