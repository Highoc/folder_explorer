from rest_framework.views import APIView

from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Folder, Image
from .serializers import FolderSerializer, ImageSerializer,\
                         get_folder_form, get_image_create_form, get_image_update_form


class FolderCreateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, key=None):
        return Response(get_folder_form(), status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FolderSerializer(data=request.data)
        if serializer.is_valid():
            folder = serializer.save()
            if folder.parent_folder is None:
                key = 'root'
            else:
                key = folder.parent_folder.key.hex
            return Response({
                'name': folder.name,
                'key': folder.key.hex,
                'parent_folder_key': key,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FolderUpdateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, key=None):
        return Response(get_folder_form(), status=status.HTTP_200_OK)

    def post(self, request, key=None):
        try:
            folder = Folder.objects.get(key=key)
            folder_serializer = FolderSerializer(folder, data=request.data)
            if folder_serializer.is_valid():
                folder = folder_serializer.save()
                return Response({
                    'key': folder.key.hex,
                    'name': folder.name,
                }, status=status.HTTP_200_OK)
            else:
                return Response(folder_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Folder.DoesNotExist:
            return Response({ 'detail': 'Incorrect folder key' }, status=status.HTTP_400_BAD_REQUEST)


class ImageCreateView(APIView):
    permission_classes = (permissions.AllowAny,)
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, key=None):
        return Response(get_image_create_form(), status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.save()
            return Response({
                'name': image.name,
                'description': image.description,
                'key': image.key.hex,
                'parent_folder_key': image.folder.key.hex,
                'mime': image.mime,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageUpdateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, key=None):
        return Response(get_image_update_form(), status=status.HTTP_200_OK)

    def post(self, request, key=None):
        try:
            image = Image.objects.get(key=key)
            image.name = request.data.get('name', '')
            image.description = request.data.get('description', '')
            image.save()

            return Response({
                'name': image.name,
                'description': image.description,
                'key': image.key.hex,
                'parent_folder_key': image.folder.key.hex,
                'mime': image.mime,
            }, status=status.HTTP_200_OK)

        except Image.DoesNotExist:
            return Response({'detail': 'Incorrect image key'}, status=status.HTTP_400_BAD_REQUEST)


class ImageDeleteView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, key=None):
        try:
            image = Image.objects.get(key=key)
            image.delete()
            return Response({ 'status': 'ok' }, status=status.HTTP_200_OK)

        except Image.DoesNotExist:
            return Response({ 'detail': 'Incorrect image key' }, status=status.HTTP_400_BAD_REQUEST)


class SearchView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        search = request.GET.get('search', '').strip().lower()

        filetree = {}
        images = list(Image.objects.filter(name__icontains=search))
        folders = list(Folder.objects.filter(name__icontains=search))

        for image in images:
            key = image.folder.key.hex
            if key not in filetree:
                filetree[key] = { 'folders': [], 'images': [] }

            folders.append(image.folder)

            image_dict = {
                'name': image.name,
                'description': image.description,
                'key': image.key.hex,
                'parent_folder_key': key,
                'mime': image.mime,
            }

            if image_dict not in filetree[key]['images']:
                filetree[key]['images'].append(image_dict)


        for folder in folders:
            if folder.parent_folder is None:
                key = 'root'
            else:
                key = folder.parent_folder.key.hex
                folders.append(folder.parent_folder)

            if key not in filetree:
                filetree[key] = {'folders': [], 'images': []}

            folder_dict = {
                'name': folder.name,
                'key': folder.key.hex,
                'parent_folder_key': key,
            }

            if folder_dict not in filetree[key]['folders']:
                filetree[key]['folders'].append(folder_dict)

        return Response(filetree, status=status.HTTP_200_OK)
